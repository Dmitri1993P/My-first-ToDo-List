
//Объявление переменных
let basicInput = document.querySelector(".message"),//основной инпут
	basicButton = document.querySelector(".add"),// основная кнопка
	toDoUl = document.querySelector(".todo");// Список дел, которые будут появлятся после нажатия на кнопку (ul)
	

let toDoListArr = []; //Объявление пустого массива в который будут складыватся(и объявлятся) объекты при нажатии на кнопку

if (localStorage.getItem('toDo')){//Если есть данные по данному ключу(в данном случае имя ключа toDo)
		toDoListArr = JSON.parse(localStorage.getItem('toDo'));// Возвращение информации из localStorage в массив
		displayMessages(); 
}
//Логика кнопки
basicInput.value === "" ? basicButton.disabled = true : basicButton.disabled = false;// Делает кнопку нерабочей если инпут пустой
basicInput.addEventListener("input",function(){
	if(basicInput.value === ""){
		basicButton.disabled = true;
	}
	else if (!(basicInput.value ==="") ){
		basicButton.disabled = false;
	}
})
basicButton.addEventListener("click",function(){

	let newTodoObj = { //1)При нажатии кнопки создается объект который хранит значение введенного текста, статус проверки, статус важности. 
		todo: basicInput.value,
		checked: false,
		important: false,
	};
	toDoListArr.push(newTodoObj); //2) Этот объект пушится в массив.Таким образом при каждом клике на кнопку в массиве становится на один объект больше 
	displayMessages(toDoListArr);
	localStorage.setItem('toDo', JSON.stringify(toDoListArr)); // Занесение информации в localStorage
	basicInput.value = "";
	basicInput.value === "" ? basicButton.disabled = true : basicButton.disabled = false; // Делает кнопку нерабочей если инпут пустой
});

function displayMessages(){

	let displayMessage = "";// создана переменная отдельно от конкатанации что бы при клике на кнопку создавался новый пункт списка(объект массива), а не пытался добавится в текущий
	if(toDoListArr.length == 0){ // удаляет последний пункт
		toDoUl.innerHTML = "";
	}
	toDoListArr.forEach(function(elem,i){// в item передаются все элементы массива(в данном случае элементы массива это объекты)
		displayMessage += `
		<li>
			<input type='checkbox' id='item_${i}' ${elem.checked ? 'checked' : '' }>
			<label for='item_${i}' class="${elem.important ? 'important' : ""}">${elem.todo}</label>
		</li>
		`;// for выше указывает что он (for) ссылается на id сверху(то есть у инпута и у лейбла одинаковый id)
		toDoUl.innerHTML = displayMessage;
	});
}

toDoUl.addEventListener("change",function(event){// данный код позволяет сохранять статус флажков при обновлении страницы
	let idInput = event.target.getAttribute('id');

	let forLabel = toDoUl.querySelector(`[for=`+ idInput +`]`);


	let valueLabel = forLabel.innerHTML;


	toDoListArr.forEach(function(elem){
		if(elem.todo === valueLabel){
			elem.checked = !elem.checked;
			localStorage.setItem('toDo', JSON.stringify(toDoListArr)); // Занесение информации в localStorage
		}
	})
})

toDoUl.addEventListener("contextmenu", function(event){// Отменяем стандартное событие ПКМ по списку
	event.preventDefault();// Отменяет вызов контекстного меню при ПКМ
	toDoListArr.forEach(function(item,i){
		if(item.todo == event.target.innerHTML){ //Если клик выполнен с Ctrl выполняется удаление объекта с массива
			if(event.ctrlKey){
				toDoListArr.splice(i,1);
			}else{
				item.important = !item.important;// Если клик выполнен без Ctrl пункту придается(или убирается) стиль important который делает текст жирным и красным.
			}
			
			displayMessages();
			localStorage.setItem('toDo', JSON.stringify(toDoListArr)); // Занесение информации в localStorage
		}
	})
})