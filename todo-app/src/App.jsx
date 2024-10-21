import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const [isLoading, data] = useFetch('http://localhost:3000/todo');
  const [todoList, setTodoList] = useState([]);

  useEffect(() => {
    if (data) setTodoList(data);
  }, [isLoading]);

  return (
    <div>
      <Advice />
      <Clock />
      <h1>Todo List</h1>
      <TodoInput setTodoList={setTodoList} />
      <TodoList todoList={todoList} setTodoList={setTodoList} />
    </div>
  );
}

const TodoInput = ({ setTodoList }) => {
  const inputRef = useRef(null);
  const addTodo = () => {
    const newTodo = {
      content: inputRef.current.value,
    };
    fetch('http://localhost:3000/todo', {
      method: 'POST',
      body: JSON.stringify(newTodo),
    })
      .then((res) => res.json())
      .then((res) => setTodoList((prev) => [...prev, res]));
  };
  return (
    <>
      <input type="text" ref={inputRef} />
      <button onClick={addTodo}>추가</button>
    </>
  );
};

const TodoList = ({ todoList, setTodoList }) => {
  return (
    <>
      <ul>
        {todoList.map((el) => (
          <Todo key={el.id} todo={el} setTodoList={setTodoList} />
        ))}
      </ul>
    </>
  );
};
const Todo = ({ todo, setTodoList }) => {
  return (
    <li>
      {todo.content}
      <button>수정</button>
      <button
        onClick={() => {
          fetch(`http://localhost:3000/todo/${todo.id}`, {
            method: 'DELETE',
          }).then((res) => {
            if (res.ok) {
              setTodoList((prev) => prev.filter((el) => el.id !== todo.id));
            }
          });
        }}
      >
        삭제
      </button>
    </li>
  );
};

const Clock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    setInterval(() => {
      setTime(new Date());
    }, 1000);
  }, []);
  return <div>{time.toLocaleTimeString()}</div>;
};

const useFetch = (url) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setIsLoading(false);
      });
  }, [url]);
  return [isLoading, data];
};
const Advice = () => {
  const [isLoading, data] = useFetch(
    'https://korean-advice-open-api.vercel.app/api/advice'
  );

  return (
    <>
      {!isLoading && (
        <>
          <div>{data.message}</div>
          <div>{data.author}</div>
        </>
      )}
    </>
  );
};

export default App;
