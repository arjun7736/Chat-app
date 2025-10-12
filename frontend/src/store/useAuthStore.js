import { create } from "zustand";
import {axiosInstance} from "../lib/axios";
import toast from "react-hot-toast"

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isSignup:false,
  isLoggingin:false,


  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      console.log("error", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup:async(data)=>{
    set({isSignup:true})
    try {
       const res = await axiosInstance.post("/auth/signup",data)
       set({authUser:res.data})

       toast.success("Account Created")
    } catch (error) {
      console.log(error);
      toast.error(error.resposnse.data.message)
    }finally{
      set({isSignup:false})
    }
  },


  login:async(data)=>{
    set({isLoggingin:true})
    try {
       const res = await axiosInstance.post("/auth/login",data)
       set({authUser:res.data})

       toast.success("Logged In")
    } catch (error) {
      console.log(error);
      toast.error(error.resposnse.data.message)
    }finally{
      set({isLoggingin:false})
    }
  },

  logOut:async()=>{
    try {
      await axiosInstance.post("/auth/logout")
      set({authUser:null})
      toast.success("Loggedout")
    } catch (error) {
      toast.error("Error in Logout")
      console.log(error);
    }
  }
}));
