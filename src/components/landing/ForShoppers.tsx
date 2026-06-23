import { ar } from "../../content/strings";
import { FeatureRow } from "./FeatureRow";
import { type IconName } from "./Icon";

const icons: IconName[] = ["pin", "heart", "bookmark"];

export function ForShoppers() {
  const points = ar.shoppersPoints.map((text, i) => ({
    icon: icons[i],
    text,
    desc: ar.shoppersDesc[i],
  }));
  return (
    <FeatureRow
      eyebrow={ar.shoppersTitle}
      title={ar.shoppersHeadline}
      points={points}
      image={{ src: "/screens/shoppers.png", alt: ar.shoppersShot }}
      side="start"
    />
  );
}
