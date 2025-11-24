/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiResponse } from "next";
import IContextContainer from "@/server/di/IServerContainer";
import { StatusCodes } from "http-status-codes";
import { AccessDeniedError, ApiError, NotAllowedError } from "./exceptions";
import { redux } from "@/client/store";
import { addEntities, setAuth } from "@/client/store/actions";
import { ExtendedRequest } from "./BaseController";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getServerSession } from "next-auth";
import { AuthOptions } from "next-auth";
import { Session } from "next-auth";
import { GSSPFactory } from "@/types";
import { DEFAULT_PER_PAGE } from "@/constants";
import { IPagerParams } from "@/client/store/types";
import { AuthState } from "@/client/auth/authReducer";
import { GUEST_IDENTITY } from "@/acl/config.acl";

export default function getServerSidePropsContainer(
  ctx: IContextContainer,
): GSSPFactory {
  return (controllersNames, isPublic = false, route?) =>
    redux.getServerSideProps((store) => async (context) => {
      // init
      const { locale } = context;
      const props = {
        ...(await serverSideTranslations(locale ?? "en", ["common"])),
      };
      const req: ExtendedRequest = Object.assign(context.req, {
        query: context.query,
        body: {},
        env: {},
        // session: await getServerSession()
      });
      console.info("GSSP getSession");
      req.session = await getServerSession<AuthOptions, Session>(
        req,
        context.res,
        ctx.authOptions,
      );
      if (!isPublic && !req.session) {
        return {
          redirect: { destination: "/403", permanent: true },
        };
      }

      const identity = req.session?.identity ?? GUEST_IDENTITY;
      const auth: AuthState | null = { identity };
      store.dispatch(setAuth(auth));

      // collect promises from controllers
      const promises = controllersNames.map((name) => {
        return ctx[name]
          .handler(route)(req, context.res as NextApiResponse)
          .then((r) => {
            // auth = { ...(req.session?.acl ?? null), identity: (req.session?.user ?? null) };
            if (r) {
              console.log(name, ": ", JSON.stringify(r, null, 2));
              let pager: IPagerParams | undefined = undefined;
              if (
                r &&
                "items" in r &&
                "count" in r &&
                typeof r.items === "object"
              ) {
                pager = req.pager ?? {
                  count:
                    typeof r.count !== "number" ? Number(r.count) : r.count,
                  page: parseInt(req.body?.page ?? "1"),
                  pageName: req.body?.pageName,
                  perPage: req.body?.perPage
                    ? parseInt(req.body?.perPage)
                    : DEFAULT_PER_PAGE,
                  entityName: req.body.entityName,
                };
                r = r.items as any;
              }

              const entity = ctx[name].getEntityName();
              if (entity) {
                const normalize = redux.normalizer(entity);
                const normal = normalize(r as any);
                normal.result = normal.result ?? null;
                store.dispatch({
                  ...addEntities(normal.entities),
                  pager: pager,
                  result: normal.result,
                });
              } else {
                console.warn(
                  `Controller ${name} does not have an entity associated with it.`,
                );
              }
            }
          });
      });
      console.log("gssp handlers count", promises.length);
      // run promises
      try {
        await Promise.all(promises);
      } catch (error) {
        console.error("GSSP ERROR: ", (error as Error).message);

        if (error instanceof AccessDeniedError) {
          console.info("\n\nRedirect because access denied");
          return {
            redirect: { destination: "/403", permanent: true },
          };
        }
        if (error instanceof NotAllowedError) {
          return {
            props,
          };
        }

        if (error instanceof ApiError) {
          switch (error.code) {
            case StatusCodes.UNAUTHORIZED:
              return {
                redirect: { destination: "/signIn", permanent: true },
              };
            case StatusCodes.NOT_FOUND:
              return {
                notFound: true,
              };
          }
        }
        return {
          redirect: { destination: "/404", permanent: false },
        };
      }
      // end
      return {
        props,
      };
    });
}
