require 'spec_helper'

describe "flavors/index" do
  before(:each) do
    assign(:flavors, [
      stub_model(Flavor,
        :alias => "Alias",
        :name => "Name",
        :vcpus => 1,
        :memory_mb => 2,
        :flavorid => "Flavorid"
      ),
      stub_model(Flavor,
        :alias => "Alias",
        :name => "Name",
        :vcpus => 1,
        :memory_mb => 2,
        :flavorid => "Flavorid"
      )
    ])
  end

  it "renders a list of flavors" do
    render
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "tr>td", :text => "Alias".to_s, :count => 2
    assert_select "tr>td", :text => "Name".to_s, :count => 2
    assert_select "tr>td", :text => 1.to_s, :count => 2
    assert_select "tr>td", :text => 2.to_s, :count => 2
    assert_select "tr>td", :text => "Flavorid".to_s, :count => 2
  end
end
