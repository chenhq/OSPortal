class HostsController < ApplicationController
  def compute
    @compute = OpenStack::Connection.create({:username => "admin", 
                                              :api_key=>"175245a126f74b02", 
                                              :auth_method=>"password",
                                              :auth_url => "http://122.227.254.55:5000/v2.0", 
                                              :authtenant_name =>"admin", 
                                              :service_type=>"compute"})
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
    @compute = compute
    @server = @compute.get_server(params[:id])
  end
  
  def shutdown
    @compute = compute
    @server = @compute.get_server(params[:id])
    
  end

  def poweroff
    @compute = compute
    @server = @compute.get_server(params[:id])
  end

  def reboot
    @compute = compute
    params[:serverids].each do |serverid| 
      @server = @compute.get_server(serverid)
      @server.reboot
    end
      
    respond_to do |format|
      format.json { render json: { status: 0 } }
    end
  end

  def emergency_login
    @compute = compute
    @server = @compute.get_server(params[:id])
  end

  def create_image
    @compute = compute
    @server = @compute.get_server(params[:id])
  end

  def upgrade
    @compute = compute
    @server = @compute.get_server(params[:id])
  end

  def reinstall
    @compute = compute
    @server = @compute.get_server(params[:id])
  end
  
  def delete
    @compute = compute
    @server = @compute.get_server(params[:id])
  end

end
