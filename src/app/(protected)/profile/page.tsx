import { ProfilePage } from "@/screens";
import { ROUTES } from "@/shared/config/routes";
import { getRouteMetadata } from "@/shared/lib/utils/router-utils";
import { Metadata } from "next";

export const metadata: Metadata = getRouteMetadata(ROUTES.PROFILE)

export default function Page() {
    return <ProfilePage />;
}