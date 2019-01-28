import EventDispatcher from "./EventDispatcher";

interface Action {
  icon?: string;
  tooltip?: string;
  showIn?: Array<any>;
}

interface ActionArgs {
  tooltip?: any;
  icon?: string;
  onclick?: any;
}

class Action extends EventDispatcher {
  constructor(args: ActionArgs = {}) {
    super();

    this.icon = args.icon || "";
    this.tooltip = args.tooltip;

    if (args.onclick !== undefined) {
      this.onclick = args.onclick;
    }
  }

  onclick(event) {}

  pairWith(object) {}

  setIcon(newIcon) {
    let oldIcon = this.icon;

    if (newIcon === oldIcon) {
      return;
    }

    this.icon = newIcon;

    this.dispatchEvent({
      type: "icon_changed",
      action: this,
      icon: newIcon,
      oldIcon: oldIcon
    });
  }
}

export default Action;
