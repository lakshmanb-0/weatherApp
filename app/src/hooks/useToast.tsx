export const useToast = () => {
    const showToast = (message: string, type: string) => {
        let element = document.getElementById('toast')
        if (element) {
            switch (type) {
                case 'error':
                    element.innerHTML = message
                    break;
                case 'success':
                    element.innerHTML = message
                    break;
                default:
                    break;
            }
            element.style.display = 'block'
            element.style.backgroundColor = type === 'success' ? '#90EE90' : '#F08080'
            setTimeout(() => {
                element.style.display = 'none'
            }, 2000)
        }
    }
    return showToast
}
