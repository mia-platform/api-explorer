import JSONEditor from "@json-editor/json-editor";

const getCustomEditor = key =>{
  return JSONEditor.defaults.editors[key].extend({
    setContainer(container) {
      this.container = container;
      this.container.style.paddingTop = "5px";
      if (this.schema.id)
        this.container.setAttribute("data-schemaid", this.schema.id);
      if (this.schema.type && typeof this.schema.type === "string")
        this.container.setAttribute("data-schematype", this.schema.type);
      this.container.setAttribute("data-schemapath", this.path);
    }
  });

}
module.exports = getCustomEditor;
