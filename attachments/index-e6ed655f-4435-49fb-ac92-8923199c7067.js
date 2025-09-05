import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

const api = process.env.URL || "http://localhost:3001";

async function createProposal() {
  const data = {
    activity_id: "76ecac34-95cc-4dde-8669-8b75802ccf86",
    full_name: "John Doe",
    email: "nmtxma2004@gmail.com",
    phone: "0971441212",
    address: "123 Main St, Anytown, USA",

    files: {
      "3d98cf58-4359-4068-8a1e-5be25da9f568": [
        fs.createReadStream("files/test.docx"),
      ],
    },
  };

  const response = await axios.post(`${api}/proposal/send`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  console.log(response.data);
}

async function createActivity() {
  const data = {
    proposalType_id: "9a80f057-a0f4-4ae0-ada7-63b25a6162e4",
    name: "Activity with templates example",
    slug: "activity-with-templates-example",
    description: "This is a new activity.",
    documentTemplates: [
      {
        name: "Template 1",
        quantity: 2,
        is_required: true,
        file: fs.createReadStream("files/test.docx"),
        example_file: fs.createReadStream("files/test.docx"),
      },
      {
        name: "Template 1",
        quantity: 2,
        is_required: true,
        file: fs.createReadStream("files/test.docx"),
      },
      {
        name: "Template 1",
        quantity: 2,
        is_required: true,
        file: fs.createReadStream("files/test.docx"),
        example_file: fs.createReadStream("index.js"),
      },
    ],
  };

  const response = await axios.post(
    `${api}/proposal/activity/templates`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  console.log(response.data);
}

async function updateActivity() {
  const data = {
    name: "New Activity",
    slug: "new-activity",
    description: "This is a new activity.",
    documentTemplates: [
      {
        id: "5ffd7435-e250-4570-9c78-e71882f44139",
        name: "Template 0",
        quantity: 2,
        is_required: true,
        file: fs.createReadStream("files/test.docx"),
      },
      {
        // id: "5ccb1301-15b3-4519-b138-80411e587822",
        name: "Template 1",
        quantity: 4,
        is_required: true,
        file: fs.createReadStream("package.json"),
      },
      {
        id: "31373c30-5404-4989-98ff-3fcb61e26bc1",
        name: "Template 2",
        quantity: 2,
        is_required: true,
        file: fs.createReadStream("index.js"),
      },
    ],
  };

  const response = await axios.patch(
    `${api}/proposal/activity/templates/d4953dec-6fbb-4c3f-bd2d-a8b487d02b9e`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  console.log(response.data);
}

// await updateActivity();
await createActivity();
// await createProposal();
