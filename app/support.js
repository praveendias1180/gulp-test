console.log('support');

let second_image = document.getElementsByClassName('icon-second')[0];

second_image.onclick = function(e){
    console.log('clicked')
    second_image.classList = 'icon-image-1'
}