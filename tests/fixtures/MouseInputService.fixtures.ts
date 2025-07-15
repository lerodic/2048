function createMockTarget({
  classes = [],
  closestClasses = {},
  attributes = {},
}: {
  classes?: string[];
  closestClasses?: Record<string, any>;
  attributes?: Record<string, string | null>;
}): any {
  return {
    classList: {
      contains: (cls: string) => classes.includes(cls),
    },
    closest: (selector: string) => {
      return closestClasses[selector] ?? null;
    },
    getAttribute: (attr: string) => attributes[attr] ?? null,
  };
}

export function provideHandleClickTestCases() {
  const elements = [createMockTarget({})];

  const classes = [["restart-game"]];

  const firedEvents = ["gameRestarted"];

  elements.map((element, index) => {
    classes[index].forEach((cssClass) => {
      element.classList.add(cssClass);
    });

    return element;
  });

  return firedEvents.map((firedEvent, index) => {
    return {
      firedEvent,
      target: elements[index],
    };
  });
}
