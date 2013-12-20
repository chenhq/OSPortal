require 'spec_helper'

describe "flavors/edit" do
  before(:each) do
    @flavor = assign(:flavor, stub_model(Flavor))
  end

  it "renders the edit flavor form" do
    render

    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "form[action=?][method=?]", flavor_path(@flavor), "post" do
    end
  end
end
