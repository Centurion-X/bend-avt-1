/* Константы и Переменные */
const add_button = document.getElementById('add-button'),
      load_button = document.getElementById('load-button'),
      rem_button = document.getElementById('rem-button'),
      save_button = document.getElementById('save-button'),
      u_list = document.getElementById('list');

var items = document.getElementsByClassName('item'),
    item_count;

/* Обработчики событий */
add_button.addEventListener('click', function add_item()
{
    const input = document.querySelector('input.console');
    let item_value = input.value;
    if (item_value == '' && add_button.textContent == 'Добавить') item_value = 'Задача №' + (item_count + 1)
    else if (!item_value.trim())
    {
        alert ('Введите описание для задачи!')
        return;
    };
    let item = document.createElement('li');
        item.classList.add('item');
        item.setAttribute('draggable', true);
        item.innerHTML = `<input class = "checkbox" type = "radio">
                          <span> ${item_value} </span>
                          <button class = "x-button" type = "button">X</button>`;
    let items = document.querySelectorAll('input:checked');
    if (items.length != 0)
    {
        items.forEach((item, index) =>
        {
            check_status(item);
            if (index == 0)
            {
                let span = item.nextElementSibling;
                span.innerHTML = `<span>&nbsp;${item_value}</span>`;
            }
            else
            {
                item = item.parentElement;
                u_list.removeChild(item);
                item_count--;
            };
        });
    }
    else
    {
        u_list.appendChild(item);
        add_listeners(item_count);
        item_count++;
    };
    input.placeholder = 'Введите задачу для списка';
    input.value = '';
    check_buttons();
});

load_button.addEventListener('click', function load_items()
{
    let data = localStorage.getItem('TDL');
    if (data == undefined)
    {
        alert ('Вы не сохраняли список дел!');
        return;
    }
    else
    {
        u_list.innerHTML = localStorage.getItem('TDL');
        alert ('Список дел загружен!');
        check_buttons();
        set_listeners();
    }
});

rem_button.addEventListener('click', function remove_item()
{
    if (item_count == 0)
    {
        alert ('Вcе задачи уже удалены из списка!');
        return;
    };
    let items = document.querySelectorAll('span.crossed_item');
    if (items.length == 0)
    {
        alert ('Вычеркните задачу для удаления из списка!');
        return;
    }
    else
    {
        items.forEach(item =>
        {
            item = item.parentElement;
            u_list.removeChild(item);
        })
    };
    item_count -= items.length;
    check_buttons();
});

save_button.addEventListener('click', function save_items()
{
    let items = document.querySelectorAll('li.item');
    if (items.length == 0)
    {
        alert ('Список дел пуст!');
        return;
    }
    else
    {
        localStorage.setItem('TDL', u_list.innerHTML);
        alert ('Список дел сохранён!');
    }
});

u_list.addEventListener('dragstart', event => event.target.classList.add('selected'));
u_list.addEventListener('dragend', event => event.target.classList.remove('selected'));
u_list.addEventListener('dragover', event =>
{
    event.preventDefault();
    const active_element = u_list.querySelector('li.selected'),
          current_element = event.target;
    if (current_element !== active_element && current_element.hasAttribute('draggable'))
    {
        const next_element = (current_element !== active_element.nextElementSibling)
            ? current_element : current_element.nextElementSibling;
        u_list.insertBefore(active_element, next_element);
    }
});

/* Функции */
function add_listeners (index)
{                       
    let item = items[index],
        button = item.querySelector('button'),
        input = item.querySelector('input'),
        span = item.querySelector('span');
    button.addEventListener('click', function()
    {
        span.classList.toggle('crossed_item');
        check_buttons();
    });
    input.addEventListener('click', function()
    {
        check_status(this);
        check_buttons();
    });
}

function check_buttons ()
{
    let items;
    items = document.querySelectorAll('span.crossed_item');
    if (items.length != 0) rem_button.style.backgroundColor = 'red'
    else rem_button.style.backgroundColor = 'blue';
    items = document.querySelectorAll('input:checked');
    if (items.length != 0) add_button.textContent = 'Заменить'
    else add_button.textContent = 'Добавить';
}

function check_status (item)
{
    item.checked = !item.isChecked;
    item.isChecked = item.checked;
}

function set_listeners ()
{
    item_count = items.length;
    for (index = 0; index < item_count; index++)
    {
        add_listeners(index);
    };
}
set_listeners();