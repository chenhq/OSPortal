class OperatingSystemDatatable
  delegate :params, :h, :link_to, :number_to_currency, to: :@view

  def initialize(view)
    @view = view
  end

  def as_json(options = {})
    {
      sEcho: params[:sEcho].to_i,
      iTotalRecords: OperatingSystem.count,
      iTotalDisplayRecords: operating_systems.total_entries,
      aaData: data
    }
  end

  private

  def data
    operating_systems.map do |os|
      [
       os.name,
       os.name,
       os.name,
       os.name,
       os.name
      ]
    end
  end

  def operating_systems
    @operating_systems ||= fetch_operating_systems
  end

  def fetch_operating_systems
    operating_systems = OperatingSystem.order("#{sort_column} #{sort_direction}")
    operating_systems = operating_systems.page(page).per_page(per_page)
    if params[:sSearch].present?
      operating_systems = operating_systems.where("name like :search or cpubit like :search", search: "%#{params[:sSearch]}%")
    end
    operating_systems
  end

  def page
    params[:iDisplayStart].to_i/per_page + 1
  end

  def per_page
    params[:iDisplayLength].to_i > 0 ? params[:iDisplayLength].to_i : 10
  end

  def sort_column
    columns = %w[name name name name name]
    columns[params[:iSortCol_0].to_i]
  end

  def sort_direction
    params[:sSortDir_0] == "desc" ? "desc" : "asc"
  end
end

