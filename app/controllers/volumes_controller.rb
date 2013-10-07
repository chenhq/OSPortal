require 'openstack_activeresource'

class VolumesController < ApplicationController
  before_filter :authenticate_user!
  before_filter :require_openstack_login

  # GET /volumes
  # GET /volumes.json
  def index
    @volumes = OpenStack::Nova::Volume::Volume.all
    @servers = OpenStack::Nova::Compute::Server.all
    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @volumes }
    end
  end

  # GET /volumes/1
  # GET /volumes/1.json
  def show
    @volume = Volume.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @volume }
    end
  end

  # GET /volumes/new
  # GET /volumes/new.json
  def new
    @volume = OpenStack::Nova::Volume::Volume.new()

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @volume }
    end
  end

  # GET /volumes/1/edit
  def edit
    @volume = Volume.find(params[:id])
  end

  # POST /volumes
  # POST /volumes.json
  def create
    @volume = OpenStack::Nova::Volume::Volume.new(params)

    respond_to do |format|
      if @volume.save
        format.html { redirect_to volumes_path, notice: 'Volume was successfully created.' }
        format.json { render json: @volume, status: :created, location: @volume }
      else
        # format.html { render action: "new" }
        format.json { render json: @volume.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /volumes/1
  # PUT /volumes/1.json
  def update
    @volume = Volume.find(params[:id])

    respond_to do |format|
      if @volume.update_attributes(params[:volume])
        format.html { redirect_to @volume, notice: 'Volume was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @volume.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /volumes/1
  # DELETE /volumes/1.json
  def destroy
    @volume = Volume.find(params[:id])
    @volume.destroy

    respond_to do |format|
      format.html { redirect_to volumes_url }
      format.json { head :no_content }
    end
  end

  def delete
    params["id"].each do |id| 
      OpenStack::Nova::Volume::Volume.find(id).destroy
    end
    redirect_to volumes_path
  end

  def mount
    server = OpenStack::Nova::Compute::Server.find(params["server_id"])
    volume = OpenStack::Nova::Volume::Volume.find(params["volume_id"])
    va = OpenStack::Nova::Compute::VolumeAttachment.new(:device => params["device"],
                                                        :server => server,
                                                        :volume => volume)

    if va.save
      redirect_to volumes_url
    else
      respond_to do |format|
        format.json { render json: { status: -1 } }
      end
    end

  end

  def unmount
  end

end
