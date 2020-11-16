const $instructions = document.getElementById('instructions');
const $instructionsText = document.getElementById('instructions-text');

$instructions.addEventListener('click', () => {
	$instructionsText.toggleAttribute('hidden');
});

const $continueGame = document.getElementById('continue');
const existingPid = localStorage.getItem('yesnaga_pid');

$continueGame.setAttribute('disabled', !existingPid);
if (existingPid) {
	$continueGame.addEventListener('click', () => {
		window.location = '/board';
	});
}
