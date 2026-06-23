import { ar } from "../../content/strings";
import { Icon, type IconName } from "./Icon";

const items: { icon: IconName; text: string }[] = [
  { icon: "pin", text: ar.valueNear },
  { icon: "tag", text: ar.valueFree },
  { icon: "bolt", text: ar.valueInstant },
];

export function ValueStrip() {
  return (
    <div className="container value-strip">
      {items.map((i) => (
        <div className="value-chip" key={i.text}>
          <Icon name={i.icon} />
          <span>{i.text}</span>
        </div>
      ))}
    </div>
  );
}
