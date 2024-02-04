import axios from "axios";
import FormData from "form-data";

interface generateInput {
  prompt: string;
  filepath: string;
  filename: string;
}

/**
 * @todo Tell to add React, Vue outputs to the model
 * @adityathenerd
 */
export const generateCodeFromModel = async (input: generateInput) => {
  // Make form data
  const data = new FormData();
  const file = await axios.get(input.filepath, {
    responseType: "stream",
  });

  data.append("custom_prompt", input.prompt);
  data.append("image", file.data);

  // Send the request
  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${process.env.MODEL_API_URL}/generate`,
    headers: {
      ...data.getHeaders(),
    },
    data: data,
  }

  const response = await axios(config);

  const { html, react } = response.data.generated;

  // remove the ```html``` and ```jsx``` from the string
  const parsedHTML = (html as string).replace('```html', '').replace('```', '');
  const parsedReact = (react as string).replace('```jsx', '').replace('```', '');

  return {
    dsl: response.data.generated.dsl,
    html: parsedHTML,
    react: parsedReact,
  }
}