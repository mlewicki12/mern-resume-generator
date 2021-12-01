
import liquid from '../liquid';

const layout = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>resume test is this thing on</title>
    <link rel="stylesheet" href="style.css">

  </head>
  <body>
    {% block content %} no resume found {% endblock %}
    {{ name }}
  </body>
</html>
`

export const generate = async (body: any) => {
  // dynamically import eventually
  return await liquid.parseAndRender(layout, body);
}