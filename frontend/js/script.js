//Login Elements
const login = document.querySelector(".login");
const loginForm = login.querySelector(".login__form");
const loginInput = login.querySelector(".login__input");

//chat Elements
const chat = document.querySelector(".chat");
const chatForm = chat.querySelector(".chat__form");
const chatInput = chat.querySelector(".chat__input");
const chatMessages = chat.querySelector(".chat__messages");

//Cores e dados dos usuários
const colors = [
  "darkkhaki", "cornflowerblue", "green", "gold", "purple", "orange", "hotpink"
]

const user = { id: "", name: "", color: "" }

let webSocket;

// Cria um elemento de mensagem própria (do usuário)
const createMessageSelfElement = (content) => {
  const div = document.createElement("div")

  div.classList.add("message--self")
  div.innerHTML = content

  return div
}

// Cria um elemento de mensagem de outro usuário
const createMessageOtherElement = (content,sender,senderColor) => {
  const div = document.createElement("div")
  const span = document.createElement("span")

  span.style.color = senderColor

  div.classList.add("message--other")
  span.classList.add("message--sender")

  div.appendChild(span)

  span.innerHTML = sender
  div.innerHTML += content

  return div
}

// Retorna uma cor aleatória do array 'colors'
const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * colors.length)
  return colors[randomIndex]
}

// Faz scroll na tela para o fim da página
const scrollScreen = () => {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth"
  })
}

// Processa a mensagem recebida pelo WebSocket
const processMessage = ( {data} ) => {
  const { userId, userName, userColor, content } = JSON.parse(data)

  const message = userId === user.id 
    ? createMessageSelfElement(content) 
    : createMessageOtherElement(content,userName,userColor)

  chatMessages.appendChild(message)

  scrollScreen()
}

// Função que lida com o evento de login
const handleLogin = (event) => {
  event.preventDefault()

  user.id = crypto.randomUUID()
  user.name = loginInput.value
  user.color = getRandomColor()

  login.style.display = "none"
  chat.style.display = "flex"

  webSocket = new WebSocket("wss://chat-backend-b0sn.onrender.com")
  webSocket.onmessage = processMessage
}

// Função que lida com o evento de envio de mensagem
const sendMessage = (event) => {
  event.preventDefault()

  const message = {
    userId: user.id,
    userName: user.name,
    userColor: user.color,
    content: chatInput.value
  }

  webSocket.send(JSON.stringify(message))

  chatInput.value = ""
}

loginForm.addEventListener("submit", handleLogin);
chatForm.addEventListener("submit", sendMessage);