require "spec_helper"

describe VolumesController do
  describe "routing" do

    it "routes to #index" do
      get("/volumes").should route_to("volumes#index")
    end

    it "routes to #new" do
      get("/volumes/new").should route_to("volumes#new")
    end

    it "routes to #show" do
      get("/volumes/1").should route_to("volumes#show", :id => "1")
    end

    it "routes to #edit" do
      get("/volumes/1/edit").should route_to("volumes#edit", :id => "1")
    end

    it "routes to #create" do
      post("/volumes").should route_to("volumes#create")
    end

    it "routes to #update" do
      put("/volumes/1").should route_to("volumes#update", :id => "1")
    end

    it "routes to #destroy" do
      delete("/volumes/1").should route_to("volumes#destroy", :id => "1")
    end

  end
end
