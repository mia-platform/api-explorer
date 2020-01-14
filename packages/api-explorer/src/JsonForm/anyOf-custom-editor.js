/* eslint-disable no-underscore-dangle */
const baseCustomEditor = require('./get-custom-editor')

module.exports = () => baseCustomEditor('multiple').extend({
  build() {
    const self = this
    const switcher = this.theme.getSelectInput(this.display_text);
    switcher.style.backgroundColor = 'transparent';
    switcher.style.display = 'inline-block';
    switcher.style.fontStyle = 'italic';
    switcher.style.fontWeight = 'normal';
    switcher.style.height = 'auto';
    switcher.style.marginBottom = 0;
    switcher.style.marginLeft = '5px';
    switcher.style.padding = '0 0 0 3px';
    switcher.style.width = 'auto';
    switcher.multiple = true;
    switcher.addEventListener('change',function listener(e) {
      e.preventDefault();
      e.stopPropagation();

      self.switchEditor(self.display_text.indexOf(this.value));
      self.onChange(true);
    });

    const response = this._super()
    this.container.removeChild(this.switcher)
    this.container.removeChild(this.editor_holder)
    this.switcher = switcher
    this.container.appendChild(switcher)
    this.container.appendChild(this.editor_holder)

    return response
  }
})
