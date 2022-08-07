export default class Home {
  // only execute this class on the home page
  route_ () {
    return "/";
  }

  // button decorator defined by a __(targetMethod)_decoratorName
  __button_colour () {
    console.log(this);
    return "red";
  }
  
  // $ signifies that this method will be called automatically
  $button ({buttonColour}) {
    x("@x-toggled").events("click", function () {
      const toggled = x("@x-toggled", ["true", "false"]);

      if (toggled === "true") {
        x(this).write("text", "This Pressed");

        x(this).css(`background-color: ${buttonColour};`);

        return;
      }

      x(this).write("text", "Press This");
      x(this).attr("remove", "style");
    });
  }
}