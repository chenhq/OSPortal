class OsTypesController < ApplicationController

  # GET /os_types
  # GET /os_types.json
  def index
    @os_types = OsType.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @os_types, except: [:desc, :created_at, :updated_at] } 
    end
  end

  # GET /os_types/1
  # GET /os_types/1.json
  def show
    @os_type = OsType.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @os_type }
    end
  end

  # GET /os_types/new
  # GET /os_types/new.json
  def new
    @os_type = OsType.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @os_type }
    end
  end

  # GET /os_types/1/edit
  def edit
    @os_type = OsType.find(params[:id])
  end

  # POST /os_types
  # POST /os_types.json
  def create
    @os_type = OsType.new(params[:os_type])

    respond_to do |format|
      if @os_type.save
        format.html { redirect_to @os_type, notice: 'Os type was successfully created.' }
        format.json { render json: @os_type, status: :created, location: @os_type }
      else
        format.html { render action: "new" }
        format.json { render json: @os_type.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /os_types/1
  # PUT /os_types/1.json
  def update
    @os_type = OsType.find(params[:id])

    respond_to do |format|
      if @os_type.update_attributes(params[:os_type])
        format.html { redirect_to @os_type, notice: 'Os type was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @os_type.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /os_types/1
  # DELETE /os_types/1.json
  def destroy
    @os_type = OsType.find(params[:id])
    @os_type.destroy

    respond_to do |format|
      format.html { redirect_to os_types_url }
      format.json { head :no_content }
    end
  end
end
