import { ar } from "../../content/strings";
import { FeatureRow } from "./FeatureRow";
import { type IconName } from "./Icon";

const icons: IconName[] = ["megaphone", "users", "bell"];

export function ForShops() {
  const points = ar.shopsPoints.map((text, i) => ({
    icon: icons[i],
    text,
    desc: ar.shopsDesc[i],
  }));
  return (
    <FeatureRow
      eyebrow={ar.shopsTitle}
      title={ar.shopsHeadline}
      points={points}
      image={{ src: "/screens/shops.png", alt: ar.shopsShot }}
      side="end"
      cta={{ href: "#download", label: ar.shopsCta }}
    />
  );
}
