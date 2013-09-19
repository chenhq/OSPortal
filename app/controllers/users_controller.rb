# -*- coding: utf-8 -*-
class UsersController < ApplicationController
  def new
    @user = User.new
  end

  def create
    @user = User.new(params[:user])
    if @user.save
      sign_in @user
      flash[:success] = "登录成功！"
      redirect_to @user
    else
      render 'new'
    end
  end

  def show
    @user = User.find(params[:id])


  end

  def destroy
    sign_out
    redirect_to root_url
  end

end
