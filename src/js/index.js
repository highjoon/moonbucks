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

/*
 Step2 요구사항 구현을 위한 전략
 TODO localStorage Read & Write
 - [O] localStorage에 데이터를 저장한다.
  - [O] 메뉴 추가
  - [O] 메뉴 수정
  - [O] 메뉴 삭제
 - [O] localStorage에 저장되어있는 데이터를 읽어온다.

 TODO 카테고리별 메뉴판 관리
 - [O] 에스프레소 메뉴판을 관리한다.
 - [O] 프라푸치노 메뉴판을 관리한다.
 - [O] 블렌디드 메뉴판을 관리한다.
 - [O] 티바나 메뉴판을 관리한다.
 - [O] 디저트 메뉴판을 관리한다.

 TODO 페이지 접근 시 최초 데이터 Read & Rendering
 - [O] 페이지를 최초로 로딩할 때 에스프레소 메뉴를 먼저 읽어온다.
 - [O] 에스프레소 메뉴를 페이지에 그려준다.

 TODO 품절 상태 관리
 - [O] 품절 버튼을 추가한다.
 - [O] 품절 버튼을 클릭하면 localStorage에 상태값이 저장된다.
 - [O] 클릭이벤트에서 가장 가까운 li태그의 class 속성 값에 sold-out을 추가한다.
*/

const $ = (selector) => document.querySelector(selector);

const categoryBar = $("nav");
const menuForm = $("#espresso-menu-form");
const menuName = $("#espresso-menu-name");
const menuList = $("#espresso-menu-list");
const menuCount = $(".menu-count");
const menuSubmitBtn = $("#espresso-menu-submit-button");
const menuTitle = $(".heading > h2");

const store = {
  setLocalStorage(menu) {
    localStorage.setItem("menu", JSON.stringify(menu));
  },
  getLocalStorage() {
    return JSON.parse(localStorage.getItem("menu"));
  },
};

function App() {
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };
  this.currentCategory = "espresso";
  this.init = () => {
    if (store.getLocalStorage()) {
      this.menu = store.getLocalStorage();
    }
    render();
  };

  const render = () => {
    const template = this.menu[this.currentCategory]
      .map((menuItem, index) => {
        return `
    <li data-menu-id="${index}" class="menu-list-item d-flex items-center py-2">
      <span class="w-100 pl-2 menu-name ${
        menuItem.soldOut ? "sold-out" : ""
      }">${menuItem.name}</span>
      <button type="button" class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button">
        품절
      </button>
      <button type="button" class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button">
        수정
      </button>
      <button type="button" class="bg-gray-50 text-gray-500 text-sm menu-remove-button">
        삭제
      </button>
    </li>
  `;
      })
      .join("");

    menuList.innerHTML = template;
    updateMenuCount();
  };

  const addMenu = () => {
    this.menu[this.currentCategory].push({ name: menuName.value });
    store.setLocalStorage(this.menu);
    render();
    menuName.value = "";
  };

  const updateMenu = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const menuName = $menuName.innerText;
    const updatedMenuName = prompt("메뉴명을 수정하세요", menuName);

    this.menu[this.currentCategory][menuId].name = updatedMenuName;
    store.setLocalStorage(this.menu);
    $menuName.innerText = updatedMenuName;
  };

  const removeMenu = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;

    this.menu[this.currentCategory].splice(menuId, 1);
    e.target.closest("li").remove();
    store.setLocalStorage(this.menu);
    updateMenuCount();
  };

  const updateMenuCount = () => {
    const count = menuList.querySelectorAll("li").length;
    menuCount.innerText = `총 ${count}개`;
  };

  const switchMenu = (categoryTitle, categoryName) => {
    menuTitle.innerText = `${categoryTitle} 메뉴 관리`;
    this.currentCategory = categoryName;
    render();
  };

  const toggleSoldOut = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    this.menu[this.currentCategory][menuId].soldOut =
      !this.menu[this.currentCategory][menuId].soldOut;
    store.setLocalStorage(this.menu);
    render();
  };

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
      updateMenu(e);
      return;
    }

    if (e.target.classList.contains("menu-remove-button")) {
      if (confirm("삭제하시겠습니까?")) removeMenu(e);
      else return;
    }

    if (e.target.classList.contains("menu-sold-out-button")) {
      toggleSoldOut(e);
      return;
    }
  });

  categoryBar.addEventListener("click", (e) => {
    const isCategoryButton = e.target.classList.contains("cafe-category-name");
    if (isCategoryButton) {
      switchMenu(e.target.innerText, e.target.dataset.categoryName);
      return;
    }
  });
}

const app = new App();
app.init();
