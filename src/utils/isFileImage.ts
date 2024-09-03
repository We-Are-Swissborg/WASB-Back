const isFileImage = (file:  Express.Multer.File) => {
  return file && file.mimetype.split('/')[0] === 'image';
}

export default isFileImage;