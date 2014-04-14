require 'openstack_activeresource'

class KeyPairsController < ApplicationController
  before_filter :authenticate_user!
  before_filter :require_openstack_login

  def index
    @keypairs = OpenStack::Nova::Compute::KeyPair.all
    respond_to do |format|
      format.html # index.html.haml
      format.json { render json: @keypairs }
    end
  end

  def new
    @keypair = OpenStack::Nova::Compute::KeyPair.new()
    respond_to do |format|
      format.json { render json: @keypair }
    end
  end

  def create
    @keypair = OpenStack::Nova::Compute::KeyPair.new(:name => params[:name])
    
    respond_to do |format|
      begin
        @keypair.save
        format.html { redirect_to key_pairs_path, notice: 'KeyPair was successfully created.' }
        format.json { render json: @keypair, status: :created }
        # format.json { render json: @keypair, status: :created, location: @keypair }
      rescue  Exception => e
        format.html { render action: "new" }
        format.json { render json: { errors: e.to_s }, status: :unprocessable_entity }
      end
    end


  end

  def destory
  end
  
  def delete
    params[:names].each do |name| 
      @keypair = OpenStack::Nova::Compute::KeyPair.find(name)
      @keypair.destroy
    end

    respond_to do |format|
      format.html { redirect_to key_pairs_path }
      format.json { head :no_content }
    end
  end

end
