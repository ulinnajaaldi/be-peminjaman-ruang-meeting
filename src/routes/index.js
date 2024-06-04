import { HealthRouter } from "./HealthRoutes.js";
import { UserRouter } from "./UserRoutes.js";
import { AuthRouter } from "./AuthRoutes.js";
import { SaprasRouter } from "./SaprasRoutes.js";
import { RuanganRouter } from "./RuanganRoutes.js";
import { ProsesPinjamRouter } from "./ProsesPinjamRoutes.js";
import { DetailPeminjamRuanganRouter } from "./DetailPeminjamRuanganRoutes.js";
import { SaprasPeminjamanRouter } from "./SaprasPeminjamanRoutes.js";

const _routes = [
  ["/", HealthRouter],
  ["/v1/api/user", UserRouter],
  ["/v1/api/auth", AuthRouter],
  ["/v1/api/sapras", SaprasRouter],
  ["/v1/api/ruangan", RuanganRouter],
  ["/v1/api/proses-pinjam", ProsesPinjamRouter],
  ["/v1/api/detail-peminjam-ruangan", DetailPeminjamRuanganRouter],
  ["/v1/api/sapras-peminjaman", SaprasPeminjamanRouter],
];

export const routes = (app) => {
  _routes.forEach((route) => {
    const [url, router] = route;
    app.use(url, router);
  });
};
