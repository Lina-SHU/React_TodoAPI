import { useEffect, useState } from "react";
const { VITE_APP_HOST } = import.meta.env;
import axios from "axios";
import { useNavigate } from "react-router-dom";
import emptyLogo from'../assets/empty1.png';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const Todo = () => {
    const navigate = useNavigate();

    const [nickname, setNickName] = useState('');
    useEffect(() => {
        (async () => {
            try {
                const cookieValue = document.cookie
                    .split("; ")
                    .find((row) => row.startsWith("token="))
                    ?.split("=")[1];
                if (cookieValue) {
                    axios.defaults.headers.common['Authorization'] = cookieValue
                } else {
                    navigate('/');
                }
                const res = await axios.get(`${VITE_APP_HOST}/users/checkout`);
                setNickName(localStorage.getItem('nickname'));
                getTodoList();
            } catch (error) {
                setTimeout(() => navigate('/'), 2000);
            }
        })();
    }, []);

    // 取得列表
    const [todoList, setTodoList] = useState([]);
    const [selectedList, setSelectedList] = useState([]);
    const getTodoList = async() => {
        try {
            const res = await axios.get(`${VITE_APP_HOST}/todos`);
            setTodoList(res.data.data);
            setSelectedList(res.data.data);
        } catch (error) {
            alert(error);
        }
    }
    // 新增 todo
    const [newTodo, setNewTodo] = useState({ content: ''});
    const handleNewTodo = (e) => {
        const {name, value} = e.target;
        setNewTodo({...newTodo, [name]: value});
    }
    const addTodo = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${VITE_APP_HOST}/todos`, newTodo);
            getTodoList();
            setNewTodo({ content: ''});
            MySwal.fire({
                title: '新增成功',
                icon: 'success',
                toast: true,
                showConfirmButton: false,
                timer: 2000
            })
        } catch (error) {
            let text = [];
            error.response.data.message.forEach((item) => {
                text.push(item)
            })
            MySwal.fire({
                title: `${text}`,
                icon: 'error',
                toast: true
            })
        }
    }
    // 編輯 todo 狀態
    const checkTodo = async (id) => {
        try {
            const res = await axios.patch(`${VITE_APP_HOST}/todos/${id}/toggle`);
            getTodoList();
            MySwal.fire({
                title: '編輯成功',
                icon: 'success',
                toast: true,
                showConfirmButton: false,
                timer: 2000
            })
        } catch (error) {
            let text = [];
            error.response.data.message.forEach((item) => {
                text.push(item)
            })
            MySwal.fire({
                title: `${text}`,
                icon: 'error',
                toast: true
            })
        }
    }
    // 刪除 todo
    const deleteTodo = async (e, id) => {
        e.preventDefault();
        try {
            const res = await axios.delete(`${VITE_APP_HOST}/todos/${id}`);
            getTodoList();
            MySwal.fire({
                title: '刪除成功',
                icon: 'success',
                toast: true,
                showConfirmButton: false,
                timer: 2000
            })
        } catch (error) {
            let text = [];
            error.response.data.message.forEach((item) => {
                text.push(item)
            })
            MySwal.fire({
                title: `${text}`,
                icon: 'error',
                toast: true
            })
        }
    }
    // 刪除所有已完成項目
    const removeDoneAll = async (e) => {
        e.preventDefault();
        const filterDone = todoList.filter((item) => item.status);
        const ary = [];
        filterDone.forEach((item) => {
            ary.push(axios.delete(`${VITE_APP_HOST}/todos/${item.id}`));
        })

        Promise.all(ary).then((res) => {
            MySwal.fire({
                title: '清除成功',
                icon: 'success',
                toast: true,
                showConfirmButton: false,
                timer: 2000
            })
            getTodoList();
            changeTabs(e, '');
        }).catch((error) => {
            let text = [];
            error.response.data.message.forEach((item) => {
                text.push(item)
            })
            MySwal.fire({
                title: `${text}`,
                icon: 'error',
                toast: true
            })
        })
    }
    // 切換 tab
    const [tab, setTab] = useState('');
    const changeTabs = (e, tab) => {
        setTab(tab);
        e.preventDefault();
        const obj = [...todoList];
        if (tab === '') {
            setSelectedList(obj);
        } else if (tab === 'pending') {
            const selected = obj.filter((item) => !item.status);
            setSelectedList(selected);
        } else if (tab === 'finish') {
            const selected = obj.filter((item) => item.status);
            setSelectedList(selected);
        }
    }
    
    // 登出
    const logout = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${VITE_APP_HOST}/users/sign_out`);
            navigate('/');
            MySwal.fire({
                title: '登出成功',
                icon: 'success',
                toast: true,
                showConfirmButton: false,
                timer: 2000
            })
            localStorage.removeItem('nickname');
        } catch (error) {
            let text = [];
            error.response.data.message.forEach((item) => {
                text.push(item)
            })
            MySwal.fire({
                title: `${text}`,
                icon: 'error',
                toast: true
            })
        }
    }
    return (<>
        <div id="todoListPage" className="bg-half">
            <nav>
                <h1><a href="#">ONLINE TODO LIST</a></h1>
                <ul>
                    <li className="todo_sm"><span>{nickname} 的待辦</span></li>
                    <li><a href="#" onClick={logout}>登出</a></li>
                </ul>
            </nav>
            <div className="conatiner todoListPage vhContainer">
                <div className="todoList_Content">
                    <div className="inputBox">
                        <input type="text" value={newTodo.content} name="content" placeholder="請輸入待辦事項" onChange={handleNewTodo}/>
                        <a href="#" onClick={addTodo}>
                            <i className="fa fa-plus"></i>
                        </a>
                    </div>
                    {
                        todoList.length ? (
                            <div className="todoList_list">
                                <ul className="todoList_tab">
                                    <li><a href="#" className={tab === ''? 'active': ''} onClick={(e) => changeTabs(e, '')}>全部</a></li>
                                    <li><a href="#" className={tab === 'pending'? 'active': ''} onClick={(e) => changeTabs(e, 'pending')}>待完成</a></li>
                                    <li><a href="#" className={tab === 'finish'? 'active': ''} onClick={(e) => changeTabs(e, 'finish')}>已完成</a></li>
                                </ul>
                                <div className="todoList_items">
                                    <ul className="todoList_item">
                                        {
                                            selectedList.map((todo) => {
                                                return (<li key={todo.id}>
                                                    <label className="todoList_label">
                                                        <input className="todoList_input" type="checkbox" value="true" checked={todo.status} onChange={() => checkTodo(todo.id)}/>
                                                        <span>{todo.content}</span>
                                                    </label>
                                                    <a href="#" onClick={(e) => deleteTodo(e, todo.id)}>
                                                        <i className="fa fa-times"></i>
                                                    </a>
                                                </li>)
                                            })
                                        }
                                    </ul>
                                    <div className="todoList_statistics">
                                        <p> {todoList.filter((item) => !item.status).length || 0} 個待完成項目</p>
                                        <a href="#" onClick={removeDoneAll}>清除已完成項目</a>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center empty-margin-top">
                                <p className="empty-margin-bottom">目前尚無待辦事項</p>
                                <img src={emptyLogo} alt="" style={{maxWidth: '240px'}}/>
                            </div>
                        )
                    }
                    
                </div>
            </div>
        </div>
    </>)
}

export default Todo;