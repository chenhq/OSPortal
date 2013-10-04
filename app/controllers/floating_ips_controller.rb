require 'openstack_activeresource'

class FloatingIpsController < ApplicationController
  def auth
    # Set Keystone Public API endpoint
    OpenStack::Keystone::Public::Base.site = "http://122.227.254.55:5000/v2.0/"

    # Authentication
    auth = OpenStack::Keystone::Public::Auth.create :username => "admin", :password => "175245a126f74b02", :tenant_id => "e486e554e533455b83389720826d4c80"

    # Set the auth token for next API requests
    OpenStack::Base.token = auth.token

    # Set the Nova Compute API endpoint from the received service catalog
    OpenStack::Nova::Compute::Base.site = auth.endpoint_for('compute').publicURL
  end


  # GET /floating_ips
  # GET /floating_ips.json
  def index
    auth
    @floating_ips = OpenStack::Nova::Compute::FloatingIp.all
    @servers = OpenStack::Nova::Compute::Server.all
    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @floating_ips }
    end
  end

  # GET /floating_ips/1
  # GET /floating_ips/1.json
  def show
    @floating_ip = FloatingIp.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @floating_ip }
    end
  end

  # GET /floating_ips/new
  # GET /floating_ips/new.json
  def new
    @floating_ip = FloatingIp.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @floating_ip }
    end
  end

  # GET /floating_ips/1/edit
  def edit
    @floating_ip = FloatingIp.find(params[:id])
  end

  # POST /floating_ips
  # POST /floating_ips.json
  def create

    auth 
    @floatingip = OpenStack::Nova::Compute::FloatingIp.create

    respond_to do |format|
      format.json { render json: { status: 0 } }
    end
  end

  def addPublicIP
    auth
    1.upto(params[:ips].to_i) { |i| OpenStack::Nova::Compute::FloatingIp.create }

    respond_to do |format|
      format.json { render json: { status: 0 } }
    end

    # @floating_ip = FloatingIp.new(params[:floating_ip])

    # respond_to do |format|
    #   if @floating_ip.save
    #     format.html { redirect_to @floating_ip, notice: 'Floating ip was successfully created.' }
    #     format.json { render json: @floating_ip, status: :created, location: @floating_ip }
    #   else
    #     format.html { render action: "new" }
    #     format.json { render json: @floating_ip.errors, status: :unprocessable_entity }
    #   end
    # end
  end

  def releasePublicIP
    auth
    params.each do | k, v |
      OpenStack::Nova::Compute::FloatingIp.find(v["ip"].to_i).destroy
    end
    redirect_to floating_ips_path
    
  end
  def unbindIPtoServer
    auth
    
    # server = OpenStack::Nova::Compute::Server.find(params["0"]["server"])
    # ip     = OpenStack::Nova::Compute::FloatingIp.find(params["0"]["ip"].to_i)
    # server.remove_floating_ip(ip)
    params.each do | k, v |
      server = OpenStack::Nova::Compute::Server.find(v["server"])
      ip     = OpenStack::Nova::Compute::FloatingIp.find(v["ip"].to_i)
      server.remove_floating_ip(ip)
    end
    # {"0"=>{"ip"=>"1023", "server"=>""}, "1"=>{"ip"=>"1024", "server"=>"f0e3aaf4-d067-4f36-93c5-4095a6b77ffe"}}
    
    respond_to do |format|
      format.json { render json: { status: 0 } }
    end
  end

  def bindIPtoServer
    auth
    server = OpenStack::Nova::Compute::Server.find(params["server"])
    ip     = OpenStack::Nova::Compute::FloatingIp.find(params["floating_ip"].to_i)
    server.add_floating_ip(ip)
    redirect_to floating_ips_path
  end


  
  # PUT /floating_ips/1
  # PUT /floating_ips/1.json
  def update
    @floating_ip = FloatingIp.find(params[:id])

    respond_to do |format|
      if @floating_ip.update_attributes(params[:floating_ip])
        format.html { redirect_to @floating_ip, notice: 'Floating ip was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @floating_ip.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /floating_ips/1
  # DELETE /floating_ips/1.json
  def destroy
    @floating_ip = FloatingIp.find(params[:id])
    @floating_ip.destroy

    respond_to do |format|
      format.html { redirect_to floating_ips_url }
      format.json { head :no_content }
    end
  end
end
