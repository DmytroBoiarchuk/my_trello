export function insertAfter(referenceNode: any, newNode: any) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
