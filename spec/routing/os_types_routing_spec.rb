require "spec_helper"

describe OsTypesController do
  describe "routing" do

    it "routes to #index" do
      get("/os_types").should route_to("os_types#index")
    end

    it "routes to #new" do
      get("/os_types/new").should route_to("os_types#new")
    end

    it "routes to #show" do
      get("/os_types/1").should route_to("os_types#show", :id => "1")
    end

    it "routes to #edit" do
      get("/os_types/1/edit").should route_to("os_types#edit", :id => "1")
    end

    it "routes to #create" do
      post("/os_types").should route_to("os_types#create")
    end

    it "routes to #update" do
      put("/os_types/1").should route_to("os_types#update", :id => "1")
    end

    it "routes to #destroy" do
      delete("/os_types/1").should route_to("os_types#destroy", :id => "1")
    end

  end
end
