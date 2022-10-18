import { collection, deleteDoc, doc, onSnapshot, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../utils/firebase";
import Message from "../components/message";
import {BsTrash2Fill} from "react-icons/bs";
import {AiFillEdit} from "react-icons/ai";
import Link from "next/link";

export default function Dashboard() {

  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  const [posts, setPosts] = useState([]);

  // Check if user is logged
  const getData = async () => {
    if(loading) return;
    if(!user) return route.push("./auth/login");
    const collectionRef = collection(db, 'posts');
    const q = query(collectionRef, where('user', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot => {
      setPosts(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})));
    }));
    return unsubscribe;
  };

  //Delete post
  const deletePost = async(id) => {
    const docRef = doc(db, 'posts', id);
    await deleteDoc(docRef);
  }

  // Get user data
  useEffect(() => {
    getData();
  }, [user, loading]);

  return(
    <div>
      <h1>Your posts</h1>
      <div>
        {posts.map(post => {
          return(
            <Message {...post} key={post.id}>
              <div className="flex gap-4">
                <button onClick={() => deletePost(post.id)} className="flex text-pink-600 items-center justify-center gap-2 py-2 text-sm">
                  <BsTrash2Fill className="text-xl"/> Delete
                </button>
                <Link href={{pathname: '/post', query: post}}>
                  <button className="flex text-teal-600 items-center justify-center gap-2 py-2 text-sm">
                    <AiFillEdit className="text-xl"/> Edit
                  </button>
                </Link>
              </div>
            </Message>
          );          
        })}
      </div>
      <button 
        className=" bg-gray-800 text-white font-medium py-2 px-4 my-6 rounded-lg text-sm" 
        onClick={()=> auth.signOut()}
      >
        Sign out
      </button>
    </div>
  );
}