function MultipartFormData() {
  this.parts = {};
};

MultipartFormData.prototype.append = function append(name, part) {
  this.parts[name] = part;
};

MultipartFormData.prototype.generate = function generate() {
  const boundary = Date.now();
  const bodyParts = [];

  Object.keys(this.parts).forEach((partKey) => {
    const part = this.parts[partKey]
    console.log(part.data)
    
    // part.data = new Buffer(part.data) // .toString('base64');
    // const actualData = part.data.split('base64,')[1]

    bodyParts.push(
      `--${boundary}`,
      `Content-Disposition: form-data; name="${partKey}"${part.filename ? `; filename="${part.filename}"`: ''}`,
    );

    if (part.contentType) {
      bodyParts.push(`Content-Type: ${part.contentType}`)
    }
    
    bodyParts.push(
      // 'Content-Transfer-Encoding: base64',
      '',
      part.data);
  });

  bodyParts.push(`--${boundary}--`, '');

  return {
    headers: {
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
    },
    body: bodyParts.join('\r\n'),
  }
}

export default MultipartFormData