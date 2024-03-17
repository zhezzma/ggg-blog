import { defineTransformer } from "@nuxt/content/transformers";

function convertToHtmlStructure(node: any) {
  const htmlNode: any = {};

  if (node.topic) {
    // Convert the topic to a list item
    htmlNode.type = "element";
    htmlNode.tag = "li";
    htmlNode.props = {};
    htmlNode.children = [
      {
        type: "text",
        value: node.topic,
      },
    ];
  }

  if (node.children && node.children.length > 0) {
    // Recursive case: Convert children nodes to a list
    htmlNode.children = (htmlNode.children || []).concat({
      type: "element",
      tag: "ul",
      props: {},
      children: node.children.map(convertToHtmlStructure),
    });
  }

  return htmlNode;
}

// Wrap the root node in a 'ul' tag
function convertRootToHtmlStructure(rootNode: any) {
  return {
    type: "root",
    children: [
      {
        type: "element",
        tag: "ul",
        props: {},
        children: [convertToHtmlStructure(rootNode)],
      },
    ],
    props: {},
    toc: { title: "", searchDepth: 2, depth: 2, links: [] },
  };
}

export default defineTransformer({
  name: "ymind-transformer",
  extensions: [".ymind"],
  parse(_id: string, rawContent: any, options: any) {
    return {
      _id,
      body: convertRootToHtmlStructure(rawContent.nodeData),
    } as any;
  },
  transform: (content, options = {}) => {
    content._type = "markdown";
    content._extension = "md";
    console.log(options);
    return content;
  },
});
