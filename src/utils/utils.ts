export const isImageUrl = (url: string) => {
  return url.match(/\.(jpeg|jpg|gif|png)$/) != null
}
