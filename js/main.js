$('button.submit').on('click', function(){
	$(this).text('Подождите..');
    var form = $('form').first();
    var formdata = false;
    if (window.FormData){
        formdata = new FormData(form[0]);
    }

    var formAction = form.attr('action');

    $.ajax({
        url         : formAction,
        data        : formdata ? formdata : form.serialize(),
        cache       : false,
        contentType : false,
        processData : false,
        type        : 'post',
    }).done(function(data){
    	for(var i = 1; i < 5; i++)
    	{
    		$('#image-' + i).attr('src', 'uploads/' + data);
    	}
    	grphm_draw();
    }).always(function(data){
    	console.log(data);
    });
});

function grphm_draw() {

	Caman("#image-1", function () {
		this.contrast(80);
		this.sepia(100);
		this.colorize(255, 78, 0, 80);
		this.render(function(){
			grphm_save(this, false, '0');
		});
	});

	Caman("#image-2", function () {
		this.contrast(80);
		this.sepia(100);
		this.colorize(255, 199, 0, 80);
		this.render(function(){
			grphm_save(this, false, '1');
		});
	});

	Caman("#image-3", function () {
		this.contrast(80);
		this.sepia(100);
		this.colorize(128, 255, 13, 80);
		this.render(function(){
			grphm_save(this, false, '2');
		});
	});

	Caman("#image-4", function () {
		this.contrast(80);
		this.sepia(100);
		this.colorize(38, 194, 255, 80);
		this.render(function(){
			grphm_save(this, true, '3');
		});
	});

	var images = [];
	function grphm_save(img, flag, num) {
		var out = img.toBase64();
		images[num] = out;
		if(flag == true)
		{
			console.log(images);
			setTimeout(function(){
				$.ajax({
					url: 'php/merge.php',
					data: { array: images, type: $('input[name=type]').val() },
					type: 'post'

				}).done(function(data){
					localStorage.setItem($('input[name=phonenum]').val(), 'before');
					$('.download').attr('href', 'php/art/' + data);
					$('.download').attr('download', data);
					$('.download')[0].click();
					$('button.submit').text('Создать');
					window.location.reload();
				}).fail(function(){
					console.log(data);
				});
			}, 50);
		}
	}
}

$('.phones-before').on('click', '.sms-send-button', function(){
	var dataphone = $(this).parent().attr('data-phone');
	var that = $(this);
	that.fadeOut();
	$.ajax({
		url: 'php/send.php',
		data: {phonenum: dataphone},
		type: 'post'
	}).done(function(){
		localStorage.setItem(dataphone, 'after');
		that.parent().fadeOut();
	}).fail(function(data){
		console.log(data);
	});
});

$('.phones-before').on('click', '.sms-clear', function(){
	var dataphone = $(this).parent().attr('data-phone');
	var that = $(this);
	localStorage.removeItem(dataphone);
	that.parent().fadeOut();
});


for(var i in localStorage)
{
	var count_before = 0;
	if(localStorage[i] == 'before')
	{
		$('.phones-before').append('<li class="sms-send" data-phone="' + i + '">' + i + ' <span class="glyphicon glyphicon-remove txt-color-red sms-clear"></span><span class="glyphicon glyphicon-ok txt-color-green sms-send-button"></span></li>');
		count_before++;
	}
	$('.count-before').text(count_before);

	var count_after = 0;
	if(localStorage[i] == 'after')
	{
		$('.phones-after').append('<li>' + i);
		count_after++;
	}
	$('.count-after').text(count_after);
}