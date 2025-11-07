import React from 'react';

const TypingPanel = ({
	code = '',
	userInput = '',
	onChange = () => {},
	hasError = false,
	isCorrect = false,
	disabled = false,
	inputRef = null
}) => {
	const renderHighlightedText = (text, input, error) =>
		text.split('').map((char, index) => {
			let className = '';
			let displayChar = char;
			if (index < input.length) {
				if (index === input.length - 1 && error && input.length <= text.length) {
					className = 'incorrect';
					displayChar = input[index];
				} else if (input[index] === char) {
					className = 'correct';
				} else {
					className = 'incorrect';
				}
			}
			if (error && index === input.length) className += ' error-marker';
			return <span key={index} className={className}>{displayChar}</span>;
		});

		return (
			<div className="panel typing-panel">
				<div className="typing-container" data-correct-code={code}>
				<textarea
					ref={inputRef}
					value={userInput}
					onChange={onChange}
					disabled={disabled}
					onPaste={(e) => e.preventDefault()}
					onDrop={(e) => e.preventDefault()}
					className={`overlay-textarea ${hasError ? 'invalid' : ''}`}
					maxLength={code.length + (hasError ? 1 : 0)}
				/>
				<div className={`feedback ${disabled ? 'selectable' : ''}`} aria-hidden={!disabled}>
					{renderHighlightedText(code, userInput, hasError)}
				</div>
			</div>
		</div>
	);
};

export default TypingPanel;
