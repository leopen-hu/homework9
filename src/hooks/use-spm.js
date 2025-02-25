import { ref, onMounted, onUnmounted } from 'vue'

export function useSpm() {
  let spmText = ref()

  const getSpmKey = (dataset) =>
    dataset
      ? Object.keys(dataset)?.find((propName) => propName.startsWith('spm'))
      : undefined
  const getEventFlowNodes = (event) =>
    event.path || (event.composedPath && event.composedPath()) || []
  const getSpmValue = (spmNode) => spmNode.dataset[getSpmKey(spmNode.dataset)]
  const isSpmNode = (node) => !!getSpmKey(node.dataset)
  const isButton = (node) => node.nodeName === 'BUTTON'

  const calculateSpmTextValue = (e) => {
    const eventNodes = getEventFlowNodes(e)
    if (isButton(e.target) && isSpmNode(e.target)) {
      spmText.value = eventNodes
        .filter(isSpmNode)
        .map(getSpmValue)
        .reverse()
        .join('.')
    }
  }

  onMounted(() => document.addEventListener('click', calculateSpmTextValue))
  onUnmounted(() =>
    document.removeEventListener('click', calculateSpmTextValue)
  )

  return { spmText }
}
