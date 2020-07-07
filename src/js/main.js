import {
	getSVGs,
	Loading
} from './util/utilities';
import Cookie from './lib/Cookie';

document.addEventListener('DOMContentLoaded', () => {
	Cookie();
	getSVGs();
	Loading();
});

document.addEventListener('DOMContentLoaded', () => {});



// CHECK FORM VALID

// if ($("form").valid() === true) {}
// console.log('Kết quả kiểm tra điều kiện là:' + ' ' + $(".block-send-mail form").valid());