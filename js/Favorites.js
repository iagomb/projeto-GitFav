import { GitFav } from "./GitFav.js";
//classe que vai conter a lógica dos dados
// como os dados serão estruturados

export class Favorites {
    constructor(root){
        this.root = document.getElementById(root);
        this.arrEntries = []
        this.load()
    }

    load() {
        this.arrEntries = JSON.parse(localStorage.getItem('@GitFav:')) || []
    }

    save(){
        localStorage.setItem('@GitFav:', JSON.stringify(this.arrEntries))
    }

    async add(username) {
        try {

            const existsUser = this.arrEntries.find(entry => entry.login === username)

            if (existsUser) {
                throw new Error('Usuário já cadastrado')
            }

            const user = await GitFav.search(username)
            
            this.arrEntries = [user, ...this.arrEntries]
    
            if (username === '') {
                throw new Error('Digite um username')
            }

            this.save()
            this.update()
        } catch (error) {
            alert(error.message);
        }
    }
}

// classe que vai criar a visualização e eventos do html

export class FavoritesView extends Favorites{
    constructor(root){
        super(root)
        this.tbody = this.root.querySelector('tbody')
        this.onadd()
        this.update()
    }

    update(){
        if (this.arrEntries.length !== 0) {
            const hide = this.root.querySelector('.hide')
            hide.style.display = 'none'
        }

        this.removeAllRow()

        this.arrEntries.forEach(user => {
            const row = this.createrRow()
            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `imagem de ${user.login}`
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user a p').textContent = user.name
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers
            row.querySelector('.remove').addEventListener('click', ()=>{
                this.removeTr(user)
            })
            this.tbody.append(row)
        })
    }

    removeTr(user){
        this.arrEntries = this.arrEntries.filter(entry=>entry.login !== user.login)
        this.update()
        this.save()
    }


    createrRow(){
        const tr = document.createElement('tr')

        tr.innerHTML = `
            
            <td class="user">
                <img src="https://github.com/iagomb.png" alt="avatar do github">
                <a href="https://github.com/iagomb" target="_blank">
                    <p>Iago Moreira</p>
                    <span>iagomb</span>
                </a>
            </td>
            <td class="repositories">
                32
            </td>
            <td class="followers">
                40
            </td>
            <td>
                <button class="remove">Remover</button>
            </td>
        `

        return tr
    }

    removeAllRow(){
        this.tbody.querySelectorAll('tr')
            .forEach(tr => tr.remove())
    }

   onadd(){
        const btnClick = this.root.querySelector('.search button')
        btnClick.onclick = () => {
            const { value } = this.root.querySelector('.search input');
            this.add(value)
            console.log('cliquei');
        }

    
   }
}