function getThisWorking() {
	$('.new_col').on('click', function() {
		insertColumn();
	});
	$('.new_row').on('click', function() {
		insertRow();
	});
	$('.trashcan').on('mouseover', function() {
		removeRow($(this));
	});
	$('.trashcanCol').on('mouseover', function() {
		removeCol($(this));
	});
	$('.edit').on('mouseover', function() {
		$(this).on('click', function() {
			editRow($(this));
		});
	});
	$('.column').eq(0).css({
		'pointer-events': 'none'
	});
	$('.input_field').change(function() {
		var id = $(this).parent().parent().parent().attr('id');
		var idNum = parseInt(id.split('_')[1])
		var columnList = $('#' + id).find('.input_field');
		var list = columnList.slice(0, columnList.length - 1);
		var lastCol = columnList.length - 1
		var sum = getSumCol(list, idNum, id)
		$('#' + id).find('input[type=number]').eq(lastCol).val(sum)
		if (sum > 9000) {
			$('.power_level').html('Power Level: ' + sum)
			$('.goku').html(
				'OVER 9000!!!<br> <img id="vegeta" src="media/it_s_over_9000_____animated_gif__by_lieracc_d6drw47.gif" width="50%"><br><br>')
			$('.goku').css('color', 'red')
			$('.goku').fadeIn()
			$('#vegeta').fadeIn()
			$('footer').addClass('stickify')
			$([document.documentElement, document.body]).animate({
				scrollTop: $("#vegeta").offset().top
			}, 2000);
		} else {
			$('.power_level').html('Power Level: ' + sum)
			$('.goku').html('');
			$('footer').removeClass('stickify')
		}
		var nextId = $('#' + id).next()
		if ($(nextId).length > 0) {
			$(nextId).find('input[type=number]').eq(0).val($('#' + id).find('input[type=number]').eq(lastCol).val()).change()
		}
	});
	$('.button').on('click', function() {
		if (!$(this).hasClass('disabled')) {
			currentIndex = $(this).parent().index()
			if (currentIndex > 1) {
				if ($(this).parent().prev().find('.icon').hasClass('active')) {
					controlFlow($(this), currentIndex)
				}
			} else {
				controlFlow($(this), currentIndex)
				if ($(this).find('.icon').hasClass('active')) {
					$(this).parent().parent().prevAll().find('.button').each(function(i, x) {
						if (!$(x).find('.icon').hasClass('active')) {
							$(x).addClass('disabled')
						}
					});
				} else {
					$(this).parent().parent().prevAll().find('.button').each(function(i, x) {
						if (!$(x).find('.icon').hasClass('active')) {
							$(x).removeClass('disabled')
						}
					});
				}
			}
		}
	});
}

function button_press() {
	if (!$(this).hasClass('disabled')) {
		currentIndex = $(this).parent().index()
		if (currentIndex > 1) {
			if ($(this).parent().prev().find('.icon').hasClass('active')) {
				controlFlow($(this), currentIndex)
			}
		} else {
			controlFlow($(this), currentIndex)
			if ($(this).find('.icon').hasClass('active')) {
				$(this).parent().parent().prevAll().find('.button').each(function(i, x) {
					if (!$(x).find('.icon').hasClass('active')) {
						$(x).addClass('disabled')
					}
				});
			} else {
				$(this).parent().parent().prevAll().find('.button').each(function(i, x) {
					if (!$(x).find('.icon').hasClass('active')) {
						$(x).removeClass('disabled')
					}
				});
			}
		}
	}
}

function controlFlow(selector, currentIndex) {
	currentValue = parseInt(selector.find('input[type=number]').val())
	if (!selector.find('.icon').hasClass('active')) {
		selector.find('input[type=number]').val(selector.find('input[type=number]').val())
		var changedValue = currentValue + parseInt(selector.parent().parent().attr('value'))
		selector.find('input[type=number]').val(changedValue).change();
		if (currentIndex < selector.parent().parent().find('.column').length - 2) {
			selector.parent().next().find('input[type=number]').val(changedValue);
		}
		selector.find('.icon').toggleClass('active');
	} else {
		selector.find('input[type=number]').val(currentValue - parseInt(selector.parent().parent().attr('value'))).change()
		if (currentIndex < selector.parent().parent().find('.column').length - 2) {
			selector.parent().next().find('input[type=number]').val(0).change();
			selector.parent().next().find('.icon').removeClass('active');
			selector.removeClass('disabled');
		}
		let list = selector.parent().parent().find('.input_field')
		list = list.slice(currentIndex, list.length - 1);
		$.each(list, function(i, x) {
			$(x).val(0).change();
			$(x).parent().find('.icon').removeClass('active');
			$(x).parent().removeClass('disabled');
		});
		let list2 = selector.parent().parent().nextAll().find('.input_field')
		$.each(list2, function(i, x) {
			if (!$(x).parent().parent().hasClass('initial')) {
				$(x).val(0).change();
			}
			$(x).parent().find('.icon').removeClass('active');
		});
		selector.find('.icon').toggleClass('active');
	}
}

function getSumCol(list, idNum, id) {
	var sum = 0;
	var arr = []
	for (var i = 0; i < list.length; i++) {
		sum += parseInt(list[i].value)
		arr.push(parseInt(list[i].value))
	}
	const max = arr.reduce((a, b) => Math.max(a, b), -Infinity);
	return max
}

function insertColumn() {
	var name = prompt("Please enter column name", "Click to Edit");
	var templateColumnAll = `
    <div class="column">
    <div class="button">
        <div class="icon">&#9737;</div>
        <input type="number" class="input_field" min="0" value="0">
    </div>
    </div>
    `
	var templateColumnInitial = `<div class="column"><span class="label" contenteditable="true">` + name +
		`</span><span class="trashcanCol">&#128465;</span></div>`
	$(templateColumnInitial).insertBefore('.column.total-0')
	$(templateColumnAll).insertBefore('.column.total')
	refreshPage();
}

function insertRow() {
	$('.button').removeClass('disabled');
	var name = prompt("Please enter row name", "Click to Edit");
	var value = parseInt(prompt("Please enter row value", "1"));
	var list = $('#table_capsule').find('.row')
	let uniqueId = getRandomNumber().toString(36) + Math.random().toString(36).substring(2);
	var rowNum = uniqueId
	var htmlTemplate = list[list.length - 1].outerHTML
	htmlTemplate = htmlTemplate.replace(/(<span class=\"trashcan\">)(.+?)(<\/span>)/g, '');
	htmlTemplate = htmlTemplate.replace(/(<span class=\"edit\">)(.+?)(<\/span>)/g, '');
	htmlTemplate = htmlTemplate.replace(/(id=\".+\_)(.*?)(\")/g, '$1' + rowNum + '$3')
	htmlTemplate = htmlTemplate.replace(/(value=\")(\d{1,})(\")/g, '$1' + value + '$3')
	htmlTemplate = htmlTemplate.replace(/(?:(<div class="column name"><span class="label" contenteditable="true">)(.*?)(<\/span><\/div>))/g, '$1' + name + '$3')
	htmlTemplate = htmlTemplate.replaceAll(' active', '');
	htmlTemplate = htmlTemplate.replace(/(value=")(\d{1,})(\"\>)/g, '$1' + '0' + '$3');
	$('.icon').removeClass('active')
	$('.input_field').val(0).change();
	$('#table_capsule').append(htmlTemplate);
	$('body').html($('body').html());
	$('#row_' + rowNum).append('<span class="trashcan">&#128465;</span>')
	$('#row_' + rowNum).append('<span class="edit">&#9998;</span>')
	getThisWorking();
}

function removeRow(selector) {
	selector.on('click', function() {
		selector.parent().remove();
		refreshPage();
	});
}

function removeCol(selector) {
	var colIndex = (selector.parent().index());
	//remove element from dom
	selector.on('click', function() {
		$('.row').each(function(i, x) {
			if ($($(x).find('.column')[colIndex]).hasClass('total') || $($(x).find('.column')[colIndex]).hasClass('total-0')) {
				console.log('skip_col')
			} else {
				$($(x).find('.column')[colIndex]).remove();
			}
		});
		refreshPage();
	});
}

function editRow(selector) {
	var input = prompt("Please enter new value for the row", "1");
	selector.parent().attr('value', input);
	refreshPage();
}

function refreshPage() {
	$('.icon').removeClass('active');
	$('.input_field').val(0).change();
	$('.button').removeClass('disabled')
	$('body').html($('body').html());
	getThisWorking()
}

function getRandomNumber() {
	return Math.floor(Math.random() * 1000000000);
}
$(document).ready(function() {
	getThisWorking()
});