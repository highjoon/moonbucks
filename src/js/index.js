/*
 Step1 요구사항 구현을 위한 전략
 TODO 메뉴 추가
 - [O] 메뉴의 이름을 입력 받고 확인 버튼을 누르면 메뉴가 추가된다.
 - [O] 메뉴의 이름을 입력 받고 확인 버튼을 클릭하면 메뉴를 추가한다.
 - [O] 메뉴의 이름을 입력 받고 엔터키 입력으로 추가한다.
 - [O] 추가되는 메뉴의 아래 마크업은 <ul id="espresso-menu-list" class="mt-3 pl-0"></ul> 안에 삽입해야 한다.
 - [O] 총 메뉴 갯수를 count하여 상단에 보여준다.
 - [O] 메뉴가 추가되고 나면, input은 빈 값으로 초기화한다.
 - [O] 사용자 입력값이 빈 값이라면 추가되지 않는다.

 TODO 메뉴 수정
 - [O] 메뉴의 수정 버튼클릭 이벤트를 받고, 메뉴 이름을 업데이트한다.
 - [O] 모달창에서 신규 메뉴명을 입력 받고, 확인 버튼을 누르면 메뉴가 수정된다.

 TODO 메뉴 삭제
 - [O] 메뉴 삭제 버튼 클릭 이벤트를 받고, 메뉴 삭제 Confirm 모달창이 뜬다.
 - [O] 확인 버튼을 클릭하면 메뉴가 삭제된다.
 - [O] 총 메뉴 갯수를 count하여 상단에 보여준다.
*/

const $ = (selector) => document.querySelector(selector);

const menuForm = $("#espresso-menu-form");
const menuName = $("#espresso-menu-name");
const menuList = $("#espresso-menu-list");
const menuCount = $(".menu-count");
const menuSubmitBtn = $("#espresso-menu-submit-button");

const addMenu = () => {
  const menuItemTemplate = (menuName) => {
    return `
    <li class="menu-list-item d-flex items-center py-2">
      <span class="w-100 pl-2 menu-name">${menuName}</span>
      <button type="button" class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button">
        수정
      </button>
      <button type="button" class="bg-gray-50 text-gray-500 text-sm menu-remove-button">
        삭제
      </button>
    </li>
  `;
  };

  menuList.insertAdjacentHTML("beforeEnd", menuItemTemplate(menuName.value));
  menuName.value = "";
  updatedMenuCount();
};

const editMenu = () => {
  const $menuName = e.target.closest("li").querySelector(".menu-name");
  const menuName = $menuName.innerText;
  const newName = prompt("메뉴명을 수정하세요", menuName);
  $menuName.innerText = newName;
};

const removeMenu = (e) => {
  e.target.closest("li").remove();
  updatedMenuCount();
};

const updatedMenuCount = () => {
  const count = menuList.querySelectorAll("li").length;
  menuCount.innerText = `총 ${count}개`;
};

function App() {
  menuForm.addEventListener("submit", (e) => e.preventDefault());
  menuName.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      menuName.value ? addMenu() : alert("값을 입력해주세요");
    } else {
      return;
    }
  });

  menuSubmitBtn.addEventListener("click", () => {
    menuName.value ? addMenu() : alert("값을 입력해주세요");
    return;
  });

  menuList.addEventListener("click", (e) => {
    if (e.target.classList.contains("menu-edit-button")) {
      editMenu();
    }

    if (e.target.classList.contains("menu-remove-button")) {
      if (confirm("삭제하시겠습니까?")) removeMenu(e);
      else return;
    }
  });
}

App();
