require 'openstack_activeresource'

class HostsController < ApplicationController
  def compute
    @compute = OpenStack::Connection.create({:username => "admin", 
                                              :api_key=>"175245a126f74b02", 
                                              :auth_method=>"password",
                                              :auth_url => "http://122.227.254.55:5000/v2.0", 
                                              :authtenant_name =>"admin", 
                                              :service_type=>"compute"})
  end

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

 
  def new
    @ostypes = OsType.all
    @distinct_cpu_flavors = InstanceType.select(:vcpus).uniq.order(:vcpus)
    @distinct_mem_flavors = InstanceType.select(:memory_mb).uniq.order(:memory_mb)
  end

  def create
    flavor = InstanceType.where(vcpus: params[:cpu], memory_mb: params[:mem]).first
    @compute = compute
    @newserver = @compute.create_server(:name => params[:hostname], :imageRef => params[:imageid], :flavorRef => flavor.id)
    if @newserver
      respond_to do |format|
        format.json { render json: { status: 0 } }
      end
    else
      respond_to do |format|
          format.json { render json: {status: 1}, status: :unprocessable_entity }
      end
    end

    # TODO
    # change admin passwd
    # @newserver.change_password!(params[:password])

  end

  def index
    @compute = compute    
    @servers = Hash.new { |h, k| h[k] = { } }

    @compute.list_servers_detail.each do | item |
      @servers[item[:name]][:status] = item[:status]
      @servers[item[:name]][:addresses] = item[:addresses]
      @servers[item[:name]][:"OS-EXT-SRV-ATTR:host"] = item[:"OS-EXT-SRV-ATTR:host"]
      @servers[item[:name]][:image] = item[:image]
      @servers[item[:name]][:flavor] = item[:flavor]
      @servers[item[:name]][:created] = item[:created]
    end
    
    @compute.list_servers.each do |item|
      @servers[item[:name]][:id] = item[:id]
    end

  end

  def show
    @compute = compute
    @server = @compute.get_server(params[:id])
    @flavor = @compute.get_flavor(@server.flavor["id"])
    @image = @compute.get_image(@server.image["id"])
  end

  def start
    auth
    params[:serverids].each do |serverid| 
      @server = OpenStack::Nova::Compute::Server.find(serverid)
      @server.start
    end
    operation_response
  end
  
  def shutdown
   auth
    params[:serverids].each do |serverid| 
      @server = OpenStack::Nova::Compute::Server.find(serverid)
      @server.stop
    end
    operation_response
     
  end

  def poweroff
    auth
    params[:serverids].each do |serverid| 
      @server = OpenStack::Nova::Compute::Server.find(serverid)
      @server.stop
    end
    operation_response
  end

  def reboot(type=:soft)
    auth
    params[:serverids].each do |serverid| 
      @server = OpenStack::Nova::Compute::Server.find(serverid)
      @server.reboot(type)
    end
    operation_response
  end
  
  def softreboot
    reboot(:soft)
  end

  def hardreboot
    reboot(:hard)
  end

  def emergency_login
    vnc_console
  end

  def create_image
    auth
    @server = OpenStack::Nova::Compute::Server.find(params[:"img-create-instance-id"])
    @server.create_new_image(params[:"image_name"])
    
    # {"image_create_host"=>"wertyuio", "image_name"=>"dddddd", "image_desc"=>"ddd", "img-create-instance-id"=>"f7da34c1-025c-48e8-b42d-63fdb14c63b8"}
    redirect_to hosts_path
    
  end

  def upgrade
 
  end

  def reinstall
  end
  
  def delete
  end

  def operation_response
    respond_to do |format|
      format.json { render json: { status: 0 } }
    end
  end
end
