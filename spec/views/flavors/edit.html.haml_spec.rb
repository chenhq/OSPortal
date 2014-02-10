require 'spec_helper'

describe "flavors/edit" do
  before(:each) do
    @flavor = assign(:flavor, stub_model(Flavor,
      :alias => "MyString",
      :name => "MyString",
      :vcpus => 1,
      :memory_mb => 1,
      :flavorid => "MyString"
    ))
  end

  it "renders the edit flavor form" do
    render

    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "form[action=?][method=?]", flavor_path(@flavor), "post" do
      assert_select "input#flavor_alias[name=?]", "flavor[alias]"
      assert_select "input#flavor_name[name=?]", "flavor[name]"
      assert_select "input#flavor_vcpus[name=?]", "flavor[vcpus]"
      assert_select "input#flavor_memory_mb[name=?]", "flavor[memory_mb]"
      assert_select "input#flavor_flavorid[name=?]", "flavor[flavorid]"
    end
  end
end
