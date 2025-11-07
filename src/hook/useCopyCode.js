import { useCallback, useState } from 'react';

export default function useCopyCode() {
	const [showCopiedToast, setShowCopiedToast] = useState(false);

	const handleCopyCode = useCallback(async (code) => {
		if (!code) return false;
		try {
			if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
				await navigator.clipboard.writeText(code);
			} else {
				// fallback
				const ta = document.createElement('textarea');
				ta.value = code;
				document.body.appendChild(ta);
				ta.select();
				document.execCommand('copy');
				document.body.removeChild(ta);
			}
			setShowCopiedToast(true);
			setTimeout(() => setShowCopiedToast(false), 1400);
			return true;
		} catch (err) {
			// try fallback
			try {
				const ta = document.createElement('textarea');
				ta.value = code;
				document.body.appendChild(ta);
				ta.select();
				document.execCommand('copy');
				document.body.removeChild(ta);
				setShowCopiedToast(true);
				setTimeout(() => setShowCopiedToast(false), 1400);
				return true;
			} catch (e) {
				return false;
			}
		}
	}, []);

	return { handleCopyCode, showCopiedToast };
}
