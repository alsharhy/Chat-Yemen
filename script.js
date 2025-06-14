let chatList = document.getElementById("chatList");
let messagesContainer = document.getElementById("messages");
let sidebar = document.getElementById("sidebar");
let userInput = document.getElementById("userInput");

let chats = [[]]; // تبدأ أول محادثة تلقائيًا
let currentChatIndex = 0;

window.addEventListener("click", (e) => {
  if (sidebar.classList.contains("show") &&
      !sidebar.contains(e.target) &&
      e.target.className !== "toggle-sidebar") {
    sidebar.classList.remove("show");
  }
});

function toggleSidebar() {
  sidebar.classList.toggle("show");
}

function createNewChat() {
  chats.push([]);
  currentChatIndex = chats.length - 1;
  updateChatList();
  displayMessages();
}

function updateChatList() {
  chatList.innerHTML = "";
  chats.forEach((chat, index) => {
    const li = document.createElement("li");
    // توليد اسم تلقائي للمحادثة
    const name = chat.find(m => m.role === "user")?.content.slice(0, 15) || `محادثة ${index + 1}`;
    li.textContent = name;
    li.onclick = () => {
      currentChatIndex = index;
      displayMessages();
      sidebar.classList.remove("show");
    };
    chatList.appendChild(li);
  });
}

async function sendMessage() {
  const content = userInput.value.trim();
  if (!content) return;

  const userMsg = { role: "user", content };
  chats[currentChatIndex] = chats[currentChatIndex] || [];
  chats[currentChatIndex].push(userMsg);
  displayMessages();
  userInput.value = "";

  const reply = await getAIResponse(chats[currentChatIndex]);
  chats[currentChatIndex].push({ role: "assistant", content: reply });
  displayMessages();
  updateChatList();
}

function displayMessages() {
  messagesContainer.innerHTML = "";
  chats[currentChatIndex]?.forEach((msg) => {
    const div = document.createElement("div");
    div.textContent = `${msg.role === "user" ? "أنت" : "الذكاء"}: ${msg.content}`;
    div.style.margin = "0.5rem 0";
    messagesContainer.appendChild(div);
  });
}

async function getAIResponse(messages) {
  try {
    const response = await fetch("https://اسم-مشروعك.vercel.app/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages,
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("API Error:", error);
    return "حدث خطأ عند الاتصال بالذكاء الاصطناعي.";
  }
}

// عند تحميل الصفحة:
updateChatList();
displayMessages();