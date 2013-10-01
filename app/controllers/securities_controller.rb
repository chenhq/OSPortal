require 'openstack_activeresource'

class SecuritiesController < ApplicationController
  layout 'hosts'
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

  # GET /securities
  # GET /securities.json
  def index
    auth
    @firewalls =  OpenStack::Nova::Compute::SecurityGroup.all
    
    
    # respond_to do |format|
    #   format.html # index.html.erb
    #   format.json { render json: @securities }
    # end
  end

  # GET /securities/1
  # GET /securities/1.json
  def show
    @security = Security.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @security }
    end
  end

  # GET /securities/new
  # GET /securities/new.json
  def new
    @security = Security.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @security }
    end
  end

  # GET /securities/1/edit
  def edit
    @security = Security.find(params[:id])
  end

  # POST /securities
  # POST /securities.json
  def create
    @security = Security.new(params[:security])

    respond_to do |format|
      if @security.save
        format.html { redirect_to @security, notice: 'Security was successfully created.' }
        format.json { render json: @security, status: :created, location: @security }
      else
        format.html { render action: "new" }
        format.json { render json: @security.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /securities/1
  # PUT /securities/1.json
  def update
    @security = Security.find(params[:id])

    respond_to do |format|
      if @security.update_attributes(params[:security])
        format.html { redirect_to @security, notice: 'Security was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @security.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /securities/1
  # DELETE /securities/1.json
  def destroy
    @security = Security.find(params[:id])
    @security.destroy

    respond_to do |format|
      format.html { redirect_to securities_url }
      format.json { head :no_content }
    end
  end
end
